using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MorenoSeguros.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Policy_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId",
                table: "Policy");

            migrationBuilder.DropForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId1",
                table: "Policy");

            migrationBuilder.DropForeignKey(
                name: "FK_Policy_InsurancePlan_InsurancePlanId",
                table: "Policy");

            migrationBuilder.DropIndex(
                name: "IX_Policy_DeductibleOptionId1",
                table: "Policy");

            migrationBuilder.DropIndex(
                name: "IX_Policy_InsurancePlanId",
                table: "Policy");

            migrationBuilder.DropColumn(
                name: "DeductibleOptionId1",
                table: "Policy");

            migrationBuilder.DropColumn(
                name: "InsurancePlanId",
                table: "Policy");

            migrationBuilder.AlterColumn<Guid>(
                name: "DeductibleOptionId",
                table: "Policy",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId",
                table: "Policy",
                column: "DeductibleOptionId",
                principalTable: "DeductibleOption",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId",
                table: "Policy");

            migrationBuilder.AlterColumn<Guid>(
                name: "DeductibleOptionId",
                table: "Policy",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "DeductibleOptionId1",
                table: "Policy",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "InsurancePlanId",
                table: "Policy",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Policy_DeductibleOptionId1",
                table: "Policy",
                column: "DeductibleOptionId1");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_InsurancePlanId",
                table: "Policy",
                column: "InsurancePlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId",
                table: "Policy",
                column: "DeductibleOptionId",
                principalTable: "DeductibleOption",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Policy_DeductibleOption_DeductibleOptionId1",
                table: "Policy",
                column: "DeductibleOptionId1",
                principalTable: "DeductibleOption",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Policy_InsurancePlan_InsurancePlanId",
                table: "Policy",
                column: "InsurancePlanId",
                principalTable: "InsurancePlan",
                principalColumn: "Id");
        }
    }
}
