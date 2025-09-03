using Payroll.Common.ApplicationModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PayrollTransactionService.BAL.ReportModel
{
    public class PayrollComplianceRequest : BaseModel
    {
        public int Prm_Comlliance_ID { get; set; }
        public int Company_ID { get; set; }
        public bool? TDsDeducted_On_Actual_Date { get; set; }
        public decimal? Pf_Applicable_Percentage { get; set; }
        public decimal? Pf_Caping_Value { get; set; }
        public int? Excess_On_Caping_Actual { get; set; }
        public int? Pf_Based_on { get; set; }

        public decimal Esi_Applicable_Percentage { get; set; }  // NOT NULL
        public decimal? Esi_Employer_Percentage { get; set; }
        public int? Esi_Based_on { get; set; }


        public int? Pf_Applicable { get; set; }
        public int? Pf_Share_Mode_Employer { get; set; }
        public decimal? Epf_Employer_Share_Percentage { get; set; }
        public decimal? Eps_Employer_Share_Percentage { get; set; }

        public bool? VPF_Applicable { get; set; }
        public int? VPF_Mode { get; set; }
        public decimal? VPF_Percent { get; set; }
        public decimal? VPF_Employer_Share { get; set; }

        public bool? Esic_Applicable { get; set; }
        public decimal Esic_Salary_Limit { get; set; }  // NOT NULL

        public bool PT_Applicable { get; set; }         // NOT NULL
        public int Pt_Registration_Mode { get; set; }  // NOT NULL

        public int Lwf_Mode { get; set; }               // NOT NULL
        public int Lwf_Cycle { get; set; }              // NOT NULL
        public decimal? Lwf_Contribution { get; set; }  // DB says NOT NULL, but nullable in UI-safe design

        public int? bonus_Id { get; set; }
        public decimal? bonus_value { get; set; }
        public decimal? Max_work_attendence { get; set; }
        public decimal? Max_work_count { get; set; }
        public decimal? max_ot_hrs { get; set; }
        public decimal? min_salary_bonus { get; set; }
        public decimal? max_salary_bonus { get; set; }
        public decimal? min_salary_bonus_perc { get; set; }
        public decimal? max_salary_bonus_perc { get; set; }

        public int? CopyFromCompanyId { get; set; } = null;

        //public int Prm_Comlliance_ID { get; set; }
        //public int Company_ID { get; set; }
        //public bool? TDsDeducted_On_Actual_Date { get; set; }  // Nullable in DB
        // public decimal Pf_Applicable_Percentage { get; set; }
        //public int Pf_Based_on { get; set; }
        // public decimal Esi_Applicable_Percentage { get; set; }
        // public int? Esi_Based_on { get; set; }  // Nullable in DB
        // public int Pf_Applicable { get; set; }
        // public int Pf_Share_Mode_Employer { get; set; }
        // public decimal Epf_Employer_Share_Percentage { get; set; }
        // public decimal Eps_Employer_Share_Percentage { get; set; }
        // public bool VPF_Applicable { get; set; }
        // public int VPF_Mode { get; set; }
        //public bool Esic_Applicable { get; set; }
        //public decimal Esic_Salary_Limit { get; set; }
        // public bool PT_Applicable { get; set; }
        //  public int Pt_Registration_Mode { get; set; }
        // public int Lwf_Mode { get; set; }
        // public int Lwf_Cycle { get; set; }
        //// public decimal Lwf_Contribution { get; set; }
        // //public int? CopyFromCompanyId { get; set; }
        // /////////////////////
        // ///

        // public int Prm_Comlliance_ID { get; set; }
        // public int Company_ID { get; set; }

        // public bool? TDsDeducted_On_Actual_Date { get; set; }

        // public decimal? Pf_Applicable_Percentage { get; set; }
        // public decimal? Pf_Caping_Value { get; set; }
        // public int? Excess_On_Caping_Actual { get; set; }
        // public int? Pf_Based_on { get; set; }

        // public decimal Esi_Applicable_Percentage { get; set; }
        // public decimal? Esi_Employer_Percentage { get; set; }
        // public int? Esi_Based_on { get; set; }

        // public int? Pf_Applicable { get; set; }
        // public int? Pf_Share_Mode_Employer { get; set; }

        // public decimal? Epf_Employer_Share_Percentage { get; set; }
        // public decimal? Eps_Employer_Share_Percentage { get; set; }

        // public bool? VPF_Applicable { get; set; }
        // public int? VPF_Mode { get; set; }
        // public decimal? VPF_Percent { get; set; }
        // public decimal? VPF_Employer_Share { get; set; }

        // public bool? Esic_Applicable { get; set; }
        // public decimal Esic_Salary_Limit { get; set; }

        // public bool PT_Applicable { get; set; }
        // public int Pt_Registration_Mode { get; set; }

        //// public int Lwf_Mode { get; set; }
        //// public int Lwf_Cycle { get; set; }
        // public decimal Lwf_Contribution { get; set; }

        // public int? Bonus_Id { get; set; }
        // public decimal? Bonus_Value { get; set; }

        // public decimal? Max_Work_Attendence { get; set; }
        // public decimal? Max_Work_Count { get; set; }
        // public decimal? Max_Ot_Hrs { get; set; }

        // public decimal? Min_Salary_Bonus { get; set; }
        // public decimal? Max_Salary_Bonus { get; set; }
        // public decimal? Min_Salary_Bonus_Perc { get; set; }
        // public decimal? Max_Salary_Bonus_Perc { get; set; }

        // public int? CopyFromCompanyId { get; set; } = null; // default is okay

    }
}
