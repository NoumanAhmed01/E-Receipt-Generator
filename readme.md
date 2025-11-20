# E-Receipt Generator

A professional, modern web application for generating beautiful receipts for shopping bag businesses. Built with React and featuring dark mode, multiple export options, and real-time calculations.

## ✨ Features

- **🎨 Professional Receipts** - Clean, printable receipt design with company branding
- **🌙 Dark Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Works perfectly on desktop and mobile devices
- **🖼️ Multiple Export Options**
  - Save as PNG image
  - Export as PDF document
  - Direct printing support
- **📊 Real-time Calculations** - Live total calculation as you type
- **🏢 Company Branding** - Upload your company logo and details
- **📦 Shopping Bag Specific** - Optimized for bag businesses (plastic, paper, canvas, jute)
- **📞 Contact Integration** - WhatsApp contact information
- **🔄 Form Validation** - Comprehensive input validation and error handling

## 🚀 Quick Start

### Prerequisites

Make sure you have Node.js installed on your system (version 14 or higher).

### Installation

1. **Clone the repository**
   git clone https://github.com/noumanahmed01/e-receipt-generator.git
   cd e-receipt-generator

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application in action.

## 📋 How to Use

### Step 1: Fill Company Information

- Enter your company name and owner name
- Upload your company logo (optional)
- Set default contact information

### Step 2: Add Customer Details

- Input customer name
- Add business name (if applicable)

### Step 3: Enter Item Details

- Select shopper type (Plastic, Paper, Canvas, or Jute bags)
- Enter quantity in kilograms
- Set price per kilogram
- Watch the total calculate automatically

### Step 4: Generate & Export

- Click "Generate Receipt" to create your receipt
- Choose your export method:
  - **Save as Image** - Download as high-quality PNG
  - **Save as PDF** - Export as printable PDF document
  - **Print** - Direct printing with optimized layout

## 🛠️ Built With

- **React** - Frontend framework
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Styling and responsive design
- **html2canvas** - HTML to image conversion
- **jsPDF** - PDF generation
- **React Barcode** - Barcode generation
- **UUID** - Unique receipt number generation
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
src/
├── components/
│   └── ReceiptGenerator.js  # Main component
├── App.js                   # Root component
├── index.js                 # Application entry point
└── styles/                  # Global styles
```

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests, report bugs, or suggest new features.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

1. Check the [Issues](https://github.com/yourusername/e-receipt-generator/issues) page
2. Create a new issue with detailed description
3. Contact via email: your-email@example.com

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI components inspired by modern design systems
- Built with create-react-app

---

**Note**: This project is specifically designed for shopping bag businesses but can be easily adapted for other types of businesses requiring receipt generation.

⭐ Star this repo if you found it helpful!
