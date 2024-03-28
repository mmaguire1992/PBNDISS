import React from 'react';
import BackgroundVideo from './BackgroundVideo'; 

const HowTo = () => {
  return (
    <>
      <BackgroundVideo />
      <div className="container-fluid p-0">
        <div className="background-overlay"></div>
        <div className="container text-dark bg-light bg-opacity-75 my-5 p-5 rounded-3" style={{ position: "relative", zIndex: "2" }}>
          <h1 className="text-center mb-4">Welcome to Paint by Number: The Ultimate Guide</h1>
          
          <section className="mb-4">
            <h2 className="text-dark">Getting Started</h2>
            <ol className="text-dark">
              <li><strong>Creating an Account:</strong> To begin, you'll need to create an account. Click on the Register button on the top right corner of the page. Fill in your details and sign up. You can now log in with your new credentials.</li>
              <li><strong>Uploading Your Image:</strong> Once logged in, navigate to the Image Picker or Upload Image section. You can choose an image from our curated gallery or upload your own by clicking on the Upload Photo button.</li>
              <li><strong>Customising Your Project:</strong> After uploading your image, select the difficulty level for your paint-by-numbers project. You can choose from Easy, Medium, or Hard. Enter a name for your project and click on the Submit button.</li>
              <li><strong>Generating Your Paint-by-Numbers:</strong> Our system will process your image and create a custom paint-by-numbers outline along with a colour palette. Once it's ready, you'll be redirected to the results page where you can view and download your paint-by-numbers template and colour guide.</li>
            </ol>
          </section>

          <section className="mb-4">
            <h2 className="text-dark">Choosing the Perfect Image</h2>
            <p className="text-dark">The quality of your paint-by-numbers project heavily depends on the image you choose. Here are some tips for selecting an image that will yield the best results:</p>
            <h3 className="text-dark">Characteristics of a Good Image</h3>
            <ul className="text-dark">
              <li><strong>High Resolution:</strong> Choose high-quality, high-resolution images. The clearer the picture, the better the details in your paint-by-numbers project.</li>
              <li><strong>Good Lighting:</strong> Images with good lighting and contrast between the subject and background help in differentiating colours and shapes.</li>
              <li><strong>Simple Backgrounds:</strong> Simple or solid backgrounds work best as they make the main subject stand out and reduce complexity.</li>
              <li><strong>Vivid Colours:</strong> Bright and distinct colours in the image can make your paint-by-numbers more vibrant and enjoyable to work on.</li>
              <li><strong>Emotional Connection:</strong> Choose an image that means something to you. It could be a pet, a family photo, a landscape from your favourite vacation, or anything that sparks joy.</li>
            </ul>
            <h3 className="text-dark">Images to Avoid</h3>
            <ul className="text-dark">
              <li><strong>Blurry or Low-Resolution:</strong> These images will not translate well into paint-by-numbers, as the details will be lost.</li>
              <li><strong>Overly Busy Backgrounds:</strong> Complex backgrounds can make the painting process frustrating and the final product cluttered.</li>
              <li><strong>Very Dark or Very Light Images:</strong> Poor contrast can lead to a lack of definition in the final painting.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-dark">FAQs</h2>
            <p className="text-dark"><strong>Q: Can I use any image for paint-by-numbers?</strong><br />A: While you can use most images, following our tips for choosing the right image will ensure the best outcome.</p>
            <p className="text-dark"><strong>Q: What should I do if my image is low resolution?</strong><br />A: Try to find a higher-resolution version of the image or choose another image with clearer details.</p>
            <p className="text-dark"><strong>Q: How long does it take to generate a paint-by-numbers template?</strong><br />A: It usually takes just a few minutes, but this can vary depending on server load.</p>
            <p className="text-dark"><strong>Q: Can I save my progress and come back later?</strong><br />A: Yes, your uploads and projects are saved to your account for you to come back to at any time.</p>
          </section>

          <section className="mb-4">
            <h2 className="text-dark">Painting Tips for Beginners</h2>
            <ul className="text-dark">
              <li>Start from the top of the canvas and work your way down to avoid smudging.</li>
              <li>Paint darker colours first, as lighter colours can easily cover up any mistakes.</li>
              <li>Keep your brushes clean to maintain vibrant colours and sharp lines.</li>
            </ul>
          </section>

          <p className="text-center text-dark">Thank you for choosing Paint By Number. We can't wait to see what beautiful creations you bring to life!</p>
        </div>
      </div>
    </>
  );
};

export default HowTo;
