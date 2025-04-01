using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MorenoSeguros.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Company_Plan_And_Deductible_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InsuranceCompany",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LogoUrl = table.Column<string>(type: "text", nullable: true),
                    WebsiteUrl = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceCompany", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InsurancePlan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    InsuranceCompanyId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsurancePlan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsurancePlan_InsuranceCompany_InsuranceCompanyId",
                        column: x => x.InsuranceCompanyId,
                        principalTable: "InsuranceCompany",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DeductibleOption",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DeductibleIndividual = table.Column<decimal>(type: "numeric", nullable: false),
                    DeductibleFamily = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    InsurancePlanId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeductibleOption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeductibleOption_InsurancePlan_InsurancePlanId",
                        column: x => x.InsurancePlanId,
                        principalTable: "InsurancePlan",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeductibleOption_InsurancePlanId",
                table: "DeductibleOption",
                column: "InsurancePlanId");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePlan_InsuranceCompanyId",
                table: "InsurancePlan",
                column: "InsuranceCompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeductibleOption");

            migrationBuilder.DropTable(
                name: "InsurancePlan");

            migrationBuilder.DropTable(
                name: "InsuranceCompany");
        }
    }
}
