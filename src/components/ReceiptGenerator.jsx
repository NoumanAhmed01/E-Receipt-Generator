import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Printer,
  Moon,
  Sun,
  Upload,
  Calculator,
  Receipt,
  Building2,
  User,
  Package,
} from "lucide-react";

const ReceiptGenerator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "PrintBag Solutions",
      ownerName: "John Doe",
      customerName: "",
      businessName: "",
      shopperType: "Plastic Bag",
      quantity: "",
      pricePerKg: "",
      thankYouMessage: "Thank you for your business!",
      whatsappContact: "+92-300-1234567",
    },
  });

  const watchedValues = watch();
  const subtotal =
    watchedValues.quantity && watchedValues.pricePerKg
      ? (
          parseFloat(watchedValues.quantity) *
          parseFloat(watchedValues.pricePerKg)
        ).toFixed(2)
      : "0.00";

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCompanyLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateReceipt = (data) => {
    const receiptNo = uuidv4().slice(0, 8).toUpperCase();
    const currentDate = new Date();

    setReceiptData({
      ...data,
      receiptNo,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
      subtotal: parseFloat(subtotal),
      total: parseFloat(subtotal),
    });
  };

  const exportAsImage = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `receipt-${receiptData.receiptNo}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportAsPDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF with A4 size
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit the receipt on one page
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      // Set margins
      const margin = 20;
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = pdfHeight - margin * 2;

      let imgWidth = maxWidth;
      let imgHeight = imgWidth / ratio;

      // If height exceeds page, scale down
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * ratio;
      }

      // Center the image
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`receipt-${receiptData.receiptNo}.pdf`);
    }
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;

    setIsPrinting(true);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptData.receiptNo}</title>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            background: white !important;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .receipt-container {
            background: white;
            padding: 25px;
            border: 2px solid #333;
            border-radius: 0;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 0 0 rgba(0,0,0,0);
            font-family: 'Courier New', monospace;
          }
          
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          
          .border-b { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 10px; }
          .border-t { border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
          
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          
          .font-bold { font-weight: bold; }
          .text-sm { font-size: 12px; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 20px; }
          
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          
          .logo {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 50%;
            margin: 0 auto 10px;
            border: 1px solid #333;
          }
          
          @media print {
            body {
              padding: 0;
              margin: 0;
              background: white !important;
            }
            
            .receipt-container {
              box-shadow: none;
              border: 2px solid #000;
              max-width: none;
              margin: 0;
              padding: 25px;
              width: 100%;
              page-break-inside: avoid;
            }
            
            @page {
              margin: 0.5cm;
              size: auto;
            }
          }
          
          @media screen {
            .receipt-container {
              margin: 20px auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          ${receiptRef.current.innerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          };
          
          // Fallback - if window doesn't close automatically, show message
          setTimeout(function() {
            document.body.innerHTML += '<div style="text-align:center;padding:20px;color:#666;"><p>Print dialog should have opened. If not, please use browser\'s print function (Ctrl+P).</p><button onclick="window.close()">Close Window</button></div>';
          }, 2000);
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Fallback in case print doesn't work
      printWindow.addEventListener("afterprint", () => {
        setTimeout(() => {
          printWindow.close();
          setIsPrinting(false);
        }, 100);
      });

      // Additional fallback
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
          setIsPrinting(false);
        }
      }, 3000);
    } else {
      // If popup blocked, use browser's print function
      alert(
        "Popup blocked! Please allow popups for this site or use Ctrl+P to print."
      );
      setIsPrinting(false);
    }
  };

  const resetForm = () => {
    reset();
    setReceiptData(null);
    setCompanyLogo(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Receipt className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              E-Receipt Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Professional receipts for your shopping bag business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Receipt Details
              </h2>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            <form
              onSubmit={handleSubmit(generateReceipt)}
              className="space-y-6"
            >
              {/* Company Information */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Company Information
                </h3>

                {/* Company Name and Owner Name in one row on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      {...register("companyName", {
                        required: "Company name is required",
                      })}
                      className="form-input"
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Owner Name
                    </label>
                    <input
                      {...register("ownerName", {
                        required: "Owner name is required",
                      })}
                      className="form-input"
                      placeholder="Enter owner name"
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ownerName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </label>
                    {companyLogo && (
                      <img
                        src={companyLogo}
                        alt="Logo"
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    {...register("customerName", {
                      required: "Customer name is required",
                    })}
                    className="form-input"
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business Name (Optional)
                  </label>
                  <input
                    {...register("businessName")}
                    className="form-input"
                    placeholder="Enter business name"
                  />
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Item Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shopper Type
                  </label>
                  <select {...register("shopperType")} className="form-input">
                    <option value="Plastic Bag">Plastic Bag</option>
                    <option value="Paper Bag">Paper Bag</option>
                    <option value="Canvas Bag">Canvas Bag</option>
                    <option value="Jute Bag">Jute Bag</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity (KG)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: {
                          value: 0.01,
                          message: "Quantity must be greater than 0",
                        },
                      })}
                      className="form-input"
                      placeholder="0.00"
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price per KG (Rs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("pricePerKg", {
                        required: "Price is required",
                        min: {
                          value: 0.01,
                          message: "Price must be greater than 0",
                        },
                      })}
                      className="form-input"
                      placeholder="0.00"
                    />
                    {errors.pricePerKg && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pricePerKg.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Total Calculation */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      Rs. {subtotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Information */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Footer Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thank You Message
                  </label>
                  <input
                    {...register("thankYouMessage")}
                    className="form-input"
                    placeholder="Thank you message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Contact
                  </label>
                  <input
                    {...register("whatsappContact")}
                    className="form-input"
                    placeholder="+92-300-1234567"
                  />
                </div>
              </div>

              {/* Form Buttons - Improved Layout */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  Generate Receipt
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Receipt Preview */}
          <div className="space-y-6">
            {receiptData && (
              <>
                {/* Action Buttons - Improved Responsive Layout */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 no-print">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center sm:text-left">
                    Export & Print Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={exportAsImage}
                      className="btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="whitespace-nowrap">Save as Image</span>
                    </button>
                    <button
                      onClick={exportAsPDF}
                      className="btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="whitespace-nowrap">Save as PDF</span>
                    </button>
                    <button
                      onClick={printReceipt}
                      disabled={isPrinting}
                      className="btn-secondary flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {isPrinting ? "Printing..." : "Print Receipt"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Receipt - Added back font-receipt class */}
                <div
                  ref={receiptRef}
                  className="receipt-container font-receipt"
                >
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-300 dark:border-gray-600 pb-4 mb-4">
                    {companyLogo && (
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                      />
                    )}
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {receiptData.companyName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Owner: {receiptData.ownerName}
                    </p>
                  </div>

                  {/* Receipt Info */}
                  <div className="mb-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Receipt No:
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {receiptData.receiptNo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Date:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white">
                        {receiptData.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Time:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white">
                        {receiptData.time}
                      </span>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="flex justify-center mb-4">
                    <Barcode
                      value={receiptData.receiptNo}
                      width={1.5}
                      height={40}
                      fontSize={12}
                      background={darkMode ? "#1f2937" : "#ffffff"}
                      lineColor={darkMode ? "#ffffff" : "#000000"}
                    />
                  </div>

                  {/* Customer Info */}
                  <div className="border-t border-b border-gray-300 dark:border-gray-600 py-3 mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Customer Details:
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Name: {receiptData.customerName}
                    </p>
                    {receiptData.businessName && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Business: {receiptData.businessName}
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Items:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {receiptData.shopperType}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {receiptData.quantity} KG × Rs.{" "}
                          {receiptData.pricePerKg}
                        </span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          Rs. {receiptData.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        TOTAL:
                      </span>
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        Rs. {receiptData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center border-t border-gray-300 dark:border-gray-600 pt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {receiptData.thankYouMessage}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      WhatsApp: {receiptData.whatsappContact}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!receiptData && (
              <div className="receipt-container">
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Fill out the form to generate your receipt
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
