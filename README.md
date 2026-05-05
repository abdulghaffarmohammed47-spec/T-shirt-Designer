# T-shirt-Designer
AI-Powered 3D T-Shirt Designer
License React Three.js TailwindCSS

TeeCustom is a full-stack web application that allows users to design their own
custom T-shirts in a high-fidelity 3D environment. Users can change colors,
upload their own logos, and even generate unique designs using AI.

Live Demo | Report Bug

✨ Features

  - 3D Interactive Preview: View your design from any angle with smooth 3D
    rotation and zoom using Three.js.
  - Color Customization: Real-time color picker to change the fabric color of
    the T-shirt.
  - Logo & Texture Upload: Upload your own images (.png, .jpg) to place them on
    the shirt.
  - AI Design Generator: Integrated OpenAI API to generate custom graphics based
    on text prompts.
  - Download Design: Export the final mockup as an image for sharing or
    production.
  - Responsive Design: Fully optimized for mobile, tablet, and desktop screens.

🚀 Tech Stack

Frontend:

  - React.js: UI Framework.
  - Three.js: 3D graphics rendering.
  - React Three Fiber / Drei: React-based hooks for Three.js.
  - Tailwind CSS: Styling and responsiveness.
  - Framer Motion: Smooth animations and transitions.
  - Valtio: Lightweight state management.

Backend (Optional):

  - Node.js & Express: Handling API requests.
  - OpenAI API: For AI-generated textures.
  - Cloudinary: Image storage and optimization.

🛠️ Installation & Setup

Follow these steps to get the project running locally:

Prerequisites

  - Node.js (v16.0 or higher)
  - npm or yarn
  - An OpenAI API Key (if using the AI features)

1. Clone the repository

git clone https://github.com/yourusername/tshirt-designer.git
cd tshirt-designer

2. Install dependencies

# Install frontend dependencies
npm install

# Install backend dependencies (if applicable)
cd server
npm install

3. Environment Variables

Create a .env file in the root directory (and /server directory) and add your
credentials:

VITE_OPENAI_API_KEY=your_api_key_here

4. Run the application

# Run the development server
npm run dev

Open http://localhost:5173 in your browser.

📂 Project Structure

├── client/
│   ├── src/
│   │   ├── assets/       # Static images and icons
│   │   ├── canvas/       # 3D Model components (Shirt, Backdrop, Camera)
│   │   ├── components/   # UI components (CustomButton, ColorPicker, etc.)
│   │   ├── config/       # Constants and motion settings
│   │   ├── store/        # Valtio state management
│   │   └── pages/        # Main page views (Home, Customizer)
├── server/               # Node.js backend for AI generation
└── public/               # 3D Models (.glb files)

🗺️ Roadmap

- [ ] Add support for different apparel (Hoodies, Mugs, Hats).
- [ ] Implement user accounts to save designs.
- [ ] Add a "Design Marketplace" feature.
- [ ] Integrate Stripe for direct ordering.

🤝 Contributing

Contributions are what make the open-source community such an amazing place to
learn, inspire, and create.

1.  Fork the Project.
2.  Create your Feature Branch (git checkout -b feature/AmazingFeature).
3.  Commit your Changes (git commit -m 'Add some AmazingFeature').
4.  Push to the Branch (git push origin feature/AmazingFeature).
5.  Open a Pull Request.

📄 License

Distributed under the MIT License. See LICENSE for more information.

📧 Contact


Project Link: https://github.com/abdulghaffarmohammed47-spec/T-shirt Designer

If you found this project helpful, please give it a ⭐️!

