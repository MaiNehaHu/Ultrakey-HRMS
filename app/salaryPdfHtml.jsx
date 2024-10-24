// import employee details, bank details and all from backend

import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from "@/contexts/AppTheme";
import Colors from '@/constants/Colors';

const salaryPdfHtml = () => {
  const { darkTheme } = useAppTheme();
  // console.log(darkTheme);
  const bgColor = Colors[darkTheme ? "dark" : "light"].background;
  const textColor = Colors[darkTheme ? "dark" : "light"].text;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        * {
          color: ${textColor};
          background-color: ${bgColor};
        }
        body {
          padding: 20px;
        }
        .payslip-container {
          padding: 40px;
          margin: 20px auto;
          max-width: 1000px;
          max-height: 800px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: ${textColor};
          background-color: ${bgColor};
        }
        
        .payslip-header {
          text-align: center;
        }

        .company-logo {
          max-width: 150px;
          height: 50px;
          position: absolute;
          left: 0px;
          top: 0px;
          margin: 15px;
        }

        .company-details {
          text-align: center;
          flex: 1;
          margin-left: 20px;
        }

        .payslip-title {
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          text-decoration: none;
        }

        .align-items-center {
          display: flex;
          flex-direction: row;
        }

        .payslip-details {
          display: flex;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: 0 auto;
          border: 1px solid ${textColor};
        }

        .employee-details,
        .other-details {
          flex: 1;
          min-width: 220px;
          padding: 10px;
          box-sizing: border-box;
        }
        
        .employee-details p,
        .other-details p {
          display: flex;
          
          margin-bottom: 5px;
          font-size: 14px;
        }

        .employee-details p {
          width: 100%;
          display: flex;
          flex-direction: row;
        }

        .employee-details p strong,
        .employee-details p span {
          width: 50%;
        }

        .other-details p {
          width: 100%;
          display: flex;
          flex-direction: row;
        }

        .other-details p strong,
        .employee-details p span {
          width: 50%;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          body{
            padding: 30px;
          }
          
          .payslip-container,
          .payslip-container * {
            visibility: visible;
          }
          
          .payslip-container {
            position: relative;
            margin: 0;
            width: 95%;
            padding:20px;
          }
        }

         @media (max-width: 320px) {
          body{
            padding: 100px;  
          }

          .payslip-details {
            flex-direction: column;
            padding: 10px;
          }
          
          .vertical-line {
            display: none;
          }
          
          .employee-details,
          .other-details {
            width: 100%;
            padding: 10px 0;
          }
        }
          
        .employee-details,
        .other-details {
          width: 48%;
          padding: 10px;
        }
        .employee-details p {
          margin-bottom: 0.3rem;
        }
        .other-details p {
          margin-bottom: 0.3rem;
        }
        .payslip-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .payslip-table th,
        .payslip-table td {
          border: 1px solid ${textColor};
          padding: 8px;
          text-align: left;
        }
        .payslip-table th {
          font-weight: bold;
        }
        
        .net-salary,
        .footer-note {
          text-align: center;
          font-weight: bold;
        }
        .footer-note {
          font-size: 13px;
          margin-top: 10px;
        }

         .key {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          text-align: center;
          position: relative;
          border: 1px solid ${textColor};
          padding: 15px;
        }
        
        .vertical-line {
          width: 2px;
          background-color: ${textColor};
          height: 100%;
          margin: 0 auto;
        }
      </style>
    </head>

    <body>
      <div class="payslip-container">
        <div class="key">
        <img
            src=${darkTheme
      ? 'https://ultrakeyit.com/wp-content/uploads/2020/01/Ultrakey_IT_Solutions_Private_Limited_Logo_White-1024x318.png'
      : 'https://ultrakeyit.com/wp-content/uploads/2024/01/Ultrakey_IT_Solutions_Private_Limited_Logo_Color.png'
    }
            alt="Ultrakey IT Solutons Pvt. Ltd."
            class="company-logo"
          />
          <div class="company-details">
          <div class="payslip-header">
              <h3>Ultrakey IT Solutions Private Limited</h3>
              <p>
                Flat No: 204, 2nd Floor, Cyber Residency,<br />
                Indira Nagar, Gachibowli, Hyderabad - 500032<br />
                Landmark: Above Indian Bank
              </p>
              <h4 class="payslip-title">Payslip for the month of June 2024</h4>
            </div>
          </div>
          </div>

        <div class="payslip-details">
          <div class="employee-details">
            <p><strong>Name:</strong><span>Neha Kumari</span></p>
            <p><strong>Joining Date:</strong><span>11 Mar 2024</span></p>
            <p><strong>Designation:</strong> <span>Android Developer</span></p>
            <p><strong>Department:</strong><span>IT Department</span></p>
            <p><strong>Location:</strong> <span>Gachibowli</span></p>
            <p><strong>Effective Work Days:</strong><span>30</span></p>
            <p><strong>LOP:</strong><span>0</span></p>
          </div>

          <div class="col d-flex align-items-center">
            <!-- Vertical Line -->
            <div class="vertical-line"></div>
          </div>
          <div class="other-details">
            <p><strong>Employee No:</strong> <span>AKEY24015</span></p>
            <p><strong>Bank Name:</strong></p>
            <p><strong>Bank Account No:</strong></p>
            <p><strong>PAN Number:</strong></p>
            <p><strong>PF No:</strong></p>
            <p><strong>PF UAN:</strong></p>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table payslip-table">
            <thead>
              <tr>
                <th>Earnings</th>
                <th>Master</th>
                <th>Actual</th>
                <th>Deductions</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BASIC</td>
                <td>₹2000</td>
                <td>₹2000</td>
                <td>Tax</td>
                <td>- ₹200</td>
              </tr>
              <tr>
                <td>HRA</td>
                <td>₹1000</td>
                <td>₹1000</td>
                <td>LOP</td>
                <td>- ₹750</td>
              </tr>
              <tr>
                <td>CONVEYANCE</td>
                <td>₹250</td>
                <td>₹250</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>MEDICAL ALLOWANCE</td>
                <td>₹250</td>
                <td>₹250</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>SPECIAL ALLOWANCE</td>
                <td>₹1500</td>
                <td>₹1500</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td><strong>Total Earnings:INR</strong></td>
                <td>₹15000</td>
                <td>₹15000</td>
                <td><strong>Total Deductions:INR</strong></td>
                <td>- ₹950</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="net-salary">
        <p>
            Net Pay for the month (Total Earnings - Total Deductions): INR ₹14050
          </p>
          <p>(Rupees Fourteen Thousand Fifty Only)</p>
          </div>

          <div class="footer-note">
          <p>
            This is a system generated payslip and does not require a signature.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html
}

export default salaryPdfHtml

const styles = StyleSheet.create({})

