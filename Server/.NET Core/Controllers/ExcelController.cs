using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using SkinLesSuggest.Models;

namespace SkinLesSuggest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExcelController : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost]
        public IActionResult ChangeExcelFormat()
        {
            string pathToGrTruth = $@"C:\Users\stahi\Desktop\SkinLesSuggest\Server\.NET Core\ExcelFiles\grTruth.xlsx";
            ExcelPackage epGT = new ExcelPackage(new FileInfo(pathToGrTruth));
            ExcelWorksheet grTruth = epGT.Workbook.Worksheets.First();

            string pathToMet = $@"C:\Users\stahi\Desktop\SkinLesSuggest\Server\.NET Core\ExcelFiles\metadata.xlsx";
            ExcelPackage epMet = new ExcelPackage(new FileInfo(pathToMet));
            ExcelWorksheet met = epMet.Workbook.Worksheets.First();

            List<ExcelFormat> excelFormat = new List<ExcelFormat>();
            for (int rw = 2; rw <= grTruth.Dimension.End.Row; rw++)
            {
                var imageId = grTruth.Cells[rw, 1].Text.ToString();
                string dx = null;

                var mel = grTruth.Cells[rw, 2].Text.ToString();
                var nv = grTruth.Cells[rw, 3].Text.ToString();
                var bcc = grTruth.Cells[rw, 4].Text.ToString();
                var ak = grTruth.Cells[rw, 5].Text.ToString();
                var bkl = grTruth.Cells[rw, 6].Text.ToString();
                var df = grTruth.Cells[rw, 7].Text.ToString();
                var vasc = grTruth.Cells[rw, 8].Text.ToString();
                var scc = grTruth.Cells[rw, 9].Text.ToString();

                #region dx
                if (mel == "1")
                    dx = "mel";

                if (nv == "1")
                    dx = "nv";

                if (bcc == "1")
                    dx = "bcc";

                if (ak == "1")
                    dx = "akiec";

                if (bkl == "1")
                    dx = "bkl";

                if (df == "1")
                    dx = "df";

                if (vasc == "1")
                    dx = "vasc";

                if (scc == "1")
                    dx = "scc";

                #endregion

                ExcelFormat dataToAdd = new ExcelFormat()
                {
                    ImageId = imageId,
                    Dx = dx
                };

                excelFormat.Add(dataToAdd);
            }
            for (int rw = 2; rw <= met.Dimension.End.Row; rw++)
            {
                var imageId = met.Cells[rw, 1].Text.ToString();
                var age = met.Cells[rw, 2].Text.ToString();
                var localization = met.Cells[rw, 3].Text.ToString();
                var lesionId = met.Cells[rw, 4].Text.ToString();
                var sex = met.Cells[rw, 5].Text.ToString();


                var dataToUpdate = excelFormat.FirstOrDefault(x => x.ImageId == imageId);
                if (dataToUpdate != null)
                {
                    dataToUpdate.Age = age;
                    dataToUpdate.Localization = localization;
                    dataToUpdate.LesionId = string.IsNullOrEmpty(lesionId) ? Guid.NewGuid().ToString() : lesionId;
                    dataToUpdate.Sex = sex;
                } else
                {
                    Console.WriteLine($"!!!!!!!! {imageId} !!!!!!!!!!");
                }
            }

            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("HAM25000_metadata");
                worksheet.Cells[1, 1].Value = "lesion_id";
                worksheet.Cells[1, 2].Value = "image_id";
                worksheet.Cells[1, 3].Value = "dx";
                worksheet.Cells[1, 4].Value = "age";
                worksheet.Cells[1, 5].Value = "sex";
                worksheet.Cells[1, 6].Value = "localization";


                for(int i = 2; i <= excelFormat.Count + 1; i++)
                {
                    worksheet.Cells[i, 1].Value = excelFormat[i - 2].LesionId; 
                    worksheet.Cells[i, 2].Value = excelFormat[i - 2].ImageId;
                    worksheet.Cells[i, 3].Value = excelFormat[i - 2].Dx;
                    worksheet.Cells[i, 4].Value = excelFormat[i - 2].Age;
                    worksheet.Cells[i, 5].Value = excelFormat[i - 2].Sex;
                    worksheet.Cells[i, 6].Value = excelFormat[i - 2].Localization;
                }

                FileInfo excelFile = new FileInfo(@"D:\test.xlsx");
                package.SaveAs(excelFile);
            }

            return Ok();
        }
    }
}

