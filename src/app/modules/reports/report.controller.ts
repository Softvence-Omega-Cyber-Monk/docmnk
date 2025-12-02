// import { Request, Response } from "express";
// import { reportService } from "./report.service";

// const uploadReport = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { patientId } = req.body;
//     const files = req.files as Express.Multer.File[];

//     if (!patientId) {
//       res.status(400).json({
//         success: false,
//         message: "Patient ID is required"
//       });
//       return;
//     }

//     const report = await reportService.uploadReport(patientId, files);
    
//     res.status(201).json({
//       success: true,
//       message: "Report uploaded successfully",
//       data: report
//     });
//   } catch (error) {
//     console.error("Error in uploadReport controller:", error);
    
//     const errorMessage = error instanceof Error ? error.message : "Internal server error";
//     const statusCode = errorMessage.includes("No files") || errorMessage.includes("Patient ID") ? 400 : 500;

//     res.status(statusCode).json({
//       success: false,
//       message: errorMessage
//     });
//   }
// };

// const getReports = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { patientId } = req.params;

//     if (!patientId) {
//       res.status(400).json({
//         success: false,
//         message: "Patient ID is required"
//       });
//       return;
//     }

//     const reports = await reportService.getReports(patientId);
    
//     res.status(200).json({
//       success: true,
//       message: "Reports fetched successfully",
//       data: reports
//     });
//   } catch (error) {
//     console.error("Error in getReports controller:", error);
    
//     const errorMessage = error instanceof Error ? error.message : "Internal server error";
//     const statusCode = errorMessage.includes("Patient ID") ? 400 : 500;

//     res.status(statusCode).json({
//       success: false,
//       message: errorMessage
//     });
//   }
// };

// export const reportController = {
//   uploadReport,
//   getReports
// }; 


import { Request, Response } from "express";
import { reportService } from "./report.service";

const uploadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!patientId) {
      res.status(400).json({
        success: false,
        message: "Patient ID is required"
      });
      return;
    }

    // Use the same response format as patient registration
    const report = await reportService.uploadReport(patientId, files);
    
    res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      data: report
    });
  } catch (error) {
    console.error("Error in uploadReport controller:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const statusCode = errorMessage.includes("No files") || errorMessage.includes("Patient ID") ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: errorMessage
    });
  }
};

// const getReports = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { patientId } = req.params;

//     if (!patientId) {
//       res.status(400).json({
//         success: false,
//         message: "Patient ID is required"
//       });
//       return;
//     }

//     const reports = await reportService.getReports(patientId);
    
//     res.status(200).json({
//       success: true,
//       message: "Reports fetched successfully",
//       data: reports
//     });
//   } catch (error) {
//     console.error("Error in getReports controller:", error);
    
//     const errorMessage = error instanceof Error ? error.message : "Internal server error";
//     const statusCode = errorMessage.includes("Patient ID") ? 400 : 500;

//     res.status(statusCode).json({
//       success: false,
//       message: errorMessage
//     });
//   }
// };


const getReports = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const result = await reportService.getReports(patientId);

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: result, // Contains campName for each report
    });
  } catch (error: any) {
    console.error("❌ getReportsController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
    });
  }
};

const getAllReportsController = async (req: Request, res: Response) => {
  try {
    const result = await reportService.getAllReports();

    return res.status(200).json({
      message: "All reports fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("❌ Controller Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch all reports",
    });
  }
};

export const reportController = {
  uploadReport,
  getReports,
  getAllReportsController,
};