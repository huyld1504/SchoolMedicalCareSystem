/**
 * Service for generating and managing medication administration reports
 */

// Importing the medication services
// import { getMedicationById, recordAdministration, recordSkippedMedication } from './medicationAdministrationService';
import { getMedications } from './medicationService';
import { getStudentHealthRecords } from './studentHealthService';

/**
 * Generate a medication administration report by student
 * @param {string} [studentId] - Optional student ID to filter report by
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to report data
 */
export const generateStudentMedicationReport = (studentId = null, startDate = null, endDate = null) => {
  return new Promise(async (resolve) => {
    try {
      // Get all medications
      const medications = await getMedications(studentId);

      // Apply date filters if provided
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      // Process each medication to extract administration history
      const reportData = medications.map(med => {
        // Get relevant administration records within date range
        const administrationHistory = med.history?.filter(record => {
          if (!startDateObj && !endDateObj) return true;

          const recordDate = new Date(record.date);
          const afterStart = !startDateObj || recordDate >= startDateObj;
          const beforeEnd = !endDateObj || recordDate <= endDateObj;
          return afterStart && beforeEnd;
        }) || [];

        // Calculate summary statistics
        const administered = administrationHistory.filter(record => record.administered).length;
        const skipped = administrationHistory.filter(record => !record.administered).length;

        return {
          studentName: med.studentName,
          studentId: med.studentId,
          grade: med.grade,
          medication: med.medication,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: med.startDate,
          endDate: med.endDate,
          administrationHistory,
          administered,
          skipped,
          total: administered + skipped,
          complianceRate: administrationHistory.length > 0 ?
            Math.round((administered / administrationHistory.length) * 100) : 0
        };
      });

      resolve(reportData);
    } catch (error) {
      console.error("Error generating student medication report:", error);
      resolve([]);
    }
  });
};

/**
 * Generate a medication administration compliance report
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to compliance report data
 */
export const generateComplianceReport = (startDate = null, endDate = null) => {
  return new Promise(async (resolve) => {
    try {
      // Get student medication reports
      const studentReports = await generateStudentMedicationReport(null, startDate, endDate);

      // Calculate overall compliance metrics
      const totalAdministered = studentReports.reduce((sum, report) => sum + report.administered, 0);
      const totalSkipped = studentReports.reduce((sum, report) => sum + report.skipped, 0);
      const totalAdministrations = totalAdministered + totalSkipped;

      // Group medications by grade
      const gradeGroups = {};
      studentReports.forEach(report => {
        if (!gradeGroups[report.grade]) {
          gradeGroups[report.grade] = {
            administered: 0,
            skipped: 0,
            total: 0
          };
        }

        gradeGroups[report.grade].administered += report.administered;
        gradeGroups[report.grade].skipped += report.skipped;
        gradeGroups[report.grade].total += report.administered + report.skipped;
      });

      // Convert grade groups to array format with compliance rate
      const gradeCompliance = Object.keys(gradeGroups).map(grade => ({
        grade,
        administered: gradeGroups[grade].administered,
        skipped: gradeGroups[grade].skipped,
        total: gradeGroups[grade].total,
        complianceRate: gradeGroups[grade].total > 0 ?
          Math.round((gradeGroups[grade].administered / gradeGroups[grade].total) * 100) : 0
      }));

      const report = {
        overallCompliance: {
          administered: totalAdministered,
          skipped: totalSkipped,
          total: totalAdministrations,
          complianceRate: totalAdministrations > 0 ?
            Math.round((totalAdministered / totalAdministrations) * 100) : 0
        },
        gradeCompliance,
        studentReports
      };

      resolve(report);
    } catch (error) {
      console.error("Error generating compliance report:", error);
      resolve({
        overallCompliance: { administered: 0, skipped: 0, total: 0, complianceRate: 0 },
        gradeCompliance: [],
        studentReports: []
      });
    }
  });
};

/**
 * Generate an inventory usage report for medications
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to inventory usage report
 */
export const generateInventoryUsageReport = (startDate = null, endDate = null) => {
  return new Promise(async (resolve) => {
    try {
      // Get medication reports which contain usage data
      const studentReports = await generateStudentMedicationReport(null, startDate, endDate);

      // Group by medication
      const medicationUsage = {};

      studentReports.forEach(report => {
        const medicationKey = `${report.medication} ${report.dosage}`;

        if (!medicationUsage[medicationKey]) {
          medicationUsage[medicationKey] = {
            name: report.medication,
            dosage: report.dosage,
            administered: 0,
            skipped: 0,
            students: new Set()
          };
        }

        medicationUsage[medicationKey].administered += report.administered;
        medicationUsage[medicationKey].skipped += report.skipped;
        medicationUsage[medicationKey].students.add(report.studentId);
      });

      // Convert to array and calculate totals
      const medicationUsageArray = Object.values(medicationUsage).map(usage => ({
        name: usage.name,
        dosage: usage.dosage,
        administered: usage.administered,
        skipped: usage.skipped,
        total: usage.administered + usage.skipped,
        studentCount: usage.students.size
      }));

      const report = {
        medicationUsage: medicationUsageArray,
        totalDosesAdministered: medicationUsageArray.reduce((sum, med) => sum + med.administered, 0),
        totalDosesSkipped: medicationUsageArray.reduce((sum, med) => sum + med.skipped, 0)
      };

      resolve(report);
    } catch (error) {
      console.error("Error generating inventory usage report:", error);
      resolve({
        medicationUsage: [],
        totalDosesAdministered: 0,
        totalDosesSkipped: 0
      });
    }
  });
};

/**
 * Generate a time-based analysis of medication administration
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to time analysis report
 */
export const generateTimeAnalysisReport = (startDate = null, endDate = null) => {
  return new Promise(async (resolve) => {
    try {
      // Get medication reports
      const studentReports = await generateStudentMedicationReport(null, startDate, endDate);

      // Initialize time periods
      const timePeriods = {
        'Morning (8-11 AM)': { administered: 0, skipped: 0 },
        'Midday (11 AM-2 PM)': { administered: 0, skipped: 0 },
        'Afternoon (2-4 PM)': { administered: 0, skipped: 0 }
      };

      // Extract administration records and categorize by time
      studentReports.forEach(report => {
        report.administrationHistory.forEach(record => {
          // Parse the time
          const timeParts = record.time.match(/(\d+):(\d+) ([AP]M)/);
          if (!timeParts) return;

          let hour = parseInt(timeParts[1]);
          const minute = parseInt(timeParts[2]);
          const period = timeParts[3];

          // Convert to 24-hour format
          if (period === 'PM' && hour < 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;

          // Categorize by time period
          let timePeriod;
          if (hour >= 8 && hour < 11) {
            timePeriod = 'Morning (8-11 AM)';
          } else if (hour >= 11 && hour < 14) {
            timePeriod = 'Midday (11 AM-2 PM)';
          } else if (hour >= 14 && hour < 16) {
            timePeriod = 'Afternoon (2-4 PM)';
          } else {
            return; // Outside of school hours
          }

          // Increment appropriate counter
          if (record.administered) {
            timePeriods[timePeriod].administered += 1;
          } else {
            timePeriods[timePeriod].skipped += 1;
          }
        });
      });

      // Convert to array format
      const timeAnalysis = Object.keys(timePeriods).map(period => ({
        period,
        administered: timePeriods[period].administered,
        skipped: timePeriods[period].skipped,
        total: timePeriods[period].administered + timePeriods[period].skipped,
        complianceRate: (timePeriods[period].administered + timePeriods[period].skipped) > 0 ?
          Math.round((timePeriods[period].administered / (timePeriods[period].administered + timePeriods[period].skipped)) * 100) : 0
      }));

      resolve({
        timeAnalysis,
        totalByTime: {
          administered: timeAnalysis.reduce((sum, period) => sum + period.administered, 0),
          skipped: timeAnalysis.reduce((sum, period) => sum + period.skipped, 0)
        }
      });
    } catch (error) {
      console.error("Error generating time analysis report:", error);
      resolve({
        timeAnalysis: [],
        totalByTime: { administered: 0, skipped: 0 }
      });
    }
  });
};

/**
 * Generate a comprehensive medication administration report with all report types
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to comprehensive report data
 */
export const generateComprehensiveReport = (startDate = null, endDate = null) => {
  return new Promise(async (resolve) => {
    try {
      const [complianceReport, inventoryReport, timeReport] = await Promise.all([
        generateComplianceReport(startDate, endDate),
        generateInventoryUsageReport(startDate, endDate),
        generateTimeAnalysisReport(startDate, endDate)
      ]);

      resolve({
        startDate,
        endDate,
        generatedAt: new Date().toISOString(),
        compliance: complianceReport,
        inventory: inventoryReport,
        timeAnalysis: timeReport
      });
    } catch (error) {
      console.error("Error generating comprehensive report:", error);
      resolve({
        startDate,
        endDate,
        generatedAt: new Date().toISOString(),
        compliance: null,
        inventory: null,
        timeAnalysis: null
      });
    }
  });
};

/**
 * Generate an integrated report combining medication data with student health records
 * @param {string} [studentId] - Optional student ID to filter report by
 * @param {string} [startDate] - Optional start date for the report range
 * @param {string} [endDate] - Optional end date for the report range
 * @returns {Promise} Promise resolving to integrated report data
 */
export const generateIntegratedHealthReport = (studentId = null, startDate = null, endDate = null) => {
  return new Promise((resolve) => {
    try {
      // Get both medication data and health records
      Promise.all([
        generateStudentMedicationReport(studentId, startDate, endDate),
        getStudentHealthRecords(studentId)
      ]).then(([medicationData, healthRecords]) => {
        // Combine the data into an integrated report
        const integratedReport = healthRecords.map(healthRecord => {
          // Find corresponding medication data
          const medicationInfo = medicationData.find(
            med => med.studentId === healthRecord.studentId
          ) || null;

          // Extract relevant health visit data within date range
          const startDateObj = startDate ? new Date(startDate) : null;
          const endDateObj = endDate ? new Date(endDate) : null;

          const relevantVisits = healthRecord.visits?.filter(visit => {
            if (!startDateObj && !endDateObj) return true;

            const visitDate = new Date(visit.date);
            const afterStart = !startDateObj || visitDate >= startDateObj;
            const beforeEnd = !endDateObj || visitDate <= endDateObj;
            return afterStart && beforeEnd;
          }) || [];

          // Count medication-related visits
          const medicationRelatedVisits = relevantVisits.filter(visit =>
            visit.treatment.toLowerCase().includes('administered') ||
            visit.reason.toLowerCase().includes('medication')
          );

          // Calculate correlation between medication compliance and health visits
          const complianceRate = medicationInfo ? medicationInfo.complianceRate : null;

          return {
            studentId: healthRecord.studentId,
            studentName: healthRecord.studentName,
            grade: medicationInfo ? medicationInfo.grade : null,
            healthRecord: {
              allergies: healthRecord.allergies,
              chronicConditions: healthRecord.chronicConditions,
              relevantVisits,
              totalRelevantVisits: relevantVisits.length,
              medicationRelatedVisits: medicationRelatedVisits.length,
            },
            medicationData: medicationInfo ? {
              medications: medicationInfo.medication,
              dosage: medicationInfo.dosage,
              complianceRate,
              administered: medicationInfo.administered,
              skipped: medicationInfo.skipped
            } : null,
            correlationData: {
              hasMedicationData: medicationInfo !== null,
              medicationComplianceRate: complianceRate,
              healthVisitRate: relevantVisits.length,
              medicationRelatedVisitRate: medicationRelatedVisits.length > 0 ?
                Math.round((medicationRelatedVisits.length / relevantVisits.length) * 100) : 0
            }
          };
        });

        // Add cross-references to show relationships between health data and medication compliance
        const crossReferences = integratedReport
          .filter(report => report.medicationData)
          .map(report => {
            // Check if chronic conditions match with medication purpose
            const conditionsLinkedToMedication = report.healthRecord.chronicConditions.some(
              condition => report.medicationData.medications.toLowerCase().includes(condition.toLowerCase())
            );

            return {
              studentId: report.studentId,
              studentName: report.studentName,
              hasConditionMedicationMatch: conditionsLinkedToMedication,
              complianceRate: report.medicationData.complianceRate,
              healthVisitCount: report.healthRecord.totalRelevantVisits,
              medicationRelatedVisitCount: report.healthRecord.medicationRelatedVisits,
            };
          });

        resolve({
          integratedStudentReports: integratedReport,
          crossReferences,
          summary: {
            totalStudents: integratedReport.length,
            studentsWithMedication: integratedReport.filter(r => r.medicationData).length,
            avgComplianceRate: integratedReport
              .filter(r => r.medicationData)
              .reduce((sum, r) => sum + r.medicationData.complianceRate, 0) /
              integratedReport.filter(r => r.medicationData).length || 0,
            totalHealthVisits: integratedReport.reduce((sum, r) => sum + r.healthRecord.totalRelevantVisits, 0),
            medicationRelatedVisits: integratedReport.reduce((sum, r) => sum + r.healthRecord.medicationRelatedVisits, 0)
          }
        });
      });
    } catch (error) {
      console.error("Error generating integrated health report:", error);
      resolve({
        integratedStudentReports: [],
        crossReferences: [],
        summary: {
          totalStudents: 0,
          studentsWithMedication: 0,
          avgComplianceRate: 0,
          totalHealthVisits: 0,
          medicationRelatedVisits: 0
        }
      });
    }
  });
};

export default {
  generateStudentMedicationReport,
  generateComplianceReport,
  generateInventoryUsageReport,
  generateTimeAnalysisReport,
  generateComprehensiveReport,
  generateIntegratedHealthReport
};
