import React from 'react';
import Image from './assets/image.jpg'

const About = () => {
  return (
    <div className="flex flex-col items-center text-center h-screen bg-black text-white">
      <header className="p-4">
        <img
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
          alt="Workflow"
          className="h-8 w-auto sm:h-10 m-auto"
        />
      </header>

      <main className="flex flex-col justify-center items-center py-6 mx-20">
        <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>

        <div className="flex flex-col items-center">
          <p className="text-lg text-white mb-4">
            Welcome to our music platform! We are a team of passionate music enthusiasts dedicated to providing an exceptional music experience for our users.
          </p>

          <p className="text-lg text-white mb-4">
            Our mission is to connect music lovers with their favorite artists and tracks. Explore a vast collection of music, discover hidden gems, and enjoy your favorite songs.
          </p>

          <p className="text-lg text-white mb-4">
            We strive to offer a seamless and user-friendly platform for music enthusiasts. Feel free to explore, search, and enjoy music to your heart's content.
          </p>

          <p className="text-lg text-white">
            Thank you for choosing us as your music destination. We hope you enjoy your musical journey with us.
          </p>
        </div>
      </main>
      <img
          src={Image}
          alt="Music lovers enjoying music"
          className="rounded-lg shadow-md mb-4 h-[800px] object-center"
      />
    </div>
  );
};

export default About;