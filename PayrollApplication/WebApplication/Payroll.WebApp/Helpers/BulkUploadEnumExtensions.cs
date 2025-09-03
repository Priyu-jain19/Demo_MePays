/***************************************************************************************************
 *                                                                                                 
 *  Project    : Payroll Management System                                                        
 *  File       : BulkUploadEnumExtensions.cs                                                      
 *  Description: Provides an extension method to retrieve description attributes from enums.      
 *                                                                                                
 *  Author     : Harshida Parmar                                                                  
 *  Date       : December 3, 2024                                                                 
 *                                                                                                
 *  © 2024 Harshida Parmar. All Rights Reserved.                                                  
 *                                                                                                
 **************************************************************************************************/
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Payroll.WebApp.Helpers
{
    public static class BulkUploadEnumExtensions
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = field?.GetCustomAttribute<DescriptionAttribute>();
            return attribute?.Description ?? value.ToString();
        }

        // Helper method to get Display Name from Enum
        public static string GetEnumDisplayName<TEnum>(int value) where TEnum : Enum
        {
            var enumValue = (TEnum)Enum.ToObject(typeof(TEnum), value);
            var memberInfo = typeof(TEnum).GetMember(enumValue.ToString());
            if (memberInfo.Length > 0)
            {
                var displayAttribute = memberInfo[0].GetCustomAttribute<DisplayAttribute>();
                return displayAttribute?.Name ?? enumValue.ToString();
            }
            return enumValue.ToString();
        }
    }
}
