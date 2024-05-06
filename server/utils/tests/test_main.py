import sys
import unittest
from unittest.mock import patch, MagicMock
import numpy as np
import os
from google.cloud import storage

sys.path.append('/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/server/utils')

from main import print_progress, verify_numpy_array, generate_unique_filename, paint_by_numbers, upload_to_gcloud

class TestPaintByNumbers(unittest.TestCase):
    def test_print_progress(self):
        with patch('builtins.print') as mocked_print:
            print_progress("Testing", 50)
            mocked_print.assert_called_once_with("PROGRESS: Testing 50%", flush=True)

    def test_verify_numpy_array_with_correct_type(self):
        try:
            verify_numpy_array(np.array([1, 2, 3]), "test step")
        except Exception as e:
            self.fail(f"verify_numpy_array raised an exception {e}")

    def test_verify_numpy_array_with_incorrect_type(self):
        with self.assertRaises(TypeError) as context:
            verify_numpy_array([1, 2, 3], "test step")
        self.assertTrue("the image is not a NumPy array" in str(context.exception))

    @patch('main.datetime')
    def test_generate_unique_filename(self, mock_datetime):
        mock_datetime.now.return_value.strftime.return_value = "20230423_123456"
        filename = generate_unique_filename("test.jpg")
        self.assertEqual(filename, "20230423_123456.jpg")

    @patch('main.storage.Client.from_service_account_json')
    def test_upload_to_gcloud_exception_handling(self, mock_storage_client):
        mock_storage_client.return_value.bucket.return_value.blob.return_value.upload_from_filename.side_effect = Exception("Upload failed")
        with patch('builtins.print') as mocked_print:
            result = upload_to_gcloud("fake-bucket", "/fake/path/image.png", "destination_blob_name")
            mocked_print.assert_called_with("Failed to upload /fake/path/image.png to Google Cloud Storage. Error: Upload failed", flush=True)
            self.assertIsNone(result, "Expected None when upload fails")

class TestPaintByNumbersIntegration(unittest.TestCase):
    def setUp(self):
        self.test_image_path = '/Users/michaelmaguire/Downloads/PHOTO-2024-03-09-23-39-22.jpg'

    def test_process_real_image(self):
        self.assertTrue(os.path.exists(self.test_image_path), "Test image file does not exist.")
        try:
            results = paint_by_numbers(self.test_image_path, "qubpbn", "QUBGOOGLECLOUD", "easy")
            self.assertIsNotNone(results, "No results returned from processing the image")
            self.assertIn('pbnOutputUrl', results)
            self.assertIn('colouredOutputUrl', results)
            self.assertIn('colourKeyUrl', results)
            self.assertTrue(results['pbnOutputUrl'].startswith("https://"))
            self.assertTrue(results['colouredOutputUrl'].startswith("https://"))
            self.assertTrue(results['colourKeyUrl'].startswith("https://"))
        except Exception as e:
            self.fail(f"Image processing failed with an exception: {e}")

if __name__ == '__main__':
    unittest.main()
