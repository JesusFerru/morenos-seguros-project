using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MorenoSeguros.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_business_domain_logic_complete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BankAccount",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Bank = table.Column<string>(type: "text", nullable: false),
                    AccountType = table.Column<string>(type: "text", nullable: false),
                    AccountNumber = table.Column<string>(type: "text", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    HolderName = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankAccount", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Nit = table.Column<string>(type: "text", nullable: true),
                    BusinessName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    DocumentType = table.Column<string>(type: "text", nullable: false),
                    DocumentNumber = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    EmploymentStatus = table.Column<bool>(type: "boolean", nullable: false),
                    FundOrigin = table.Column<string>(type: "text", nullable: true),
                    IncomeRange = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Policy",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PolicyNumber = table.Column<string>(type: "text", nullable: false),
                    PreviousPolicyNumber = table.Column<string>(type: "text", nullable: true),
                    TitularClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    AgentId = table.Column<Guid>(type: "uuid", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    InsurancePlanId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeductibleOptionId = table.Column<Guid>(type: "uuid", nullable: true),
                    BankAccountId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeductibleOptionId1 = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Policy", x => x.Id);
                    table.UniqueConstraint("AK_Policy_PolicyNumber", x => x.PolicyNumber);
                    table.ForeignKey(
                        name: "FK_Policy_BankAccount_BankAccountId",
                        column: x => x.BankAccountId,
                        principalTable: "BankAccount",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Policy_Clients_TitularClientId",
                        column: x => x.TitularClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Policy_DeductibleOption_DeductibleOptionId",
                        column: x => x.DeductibleOptionId,
                        principalTable: "DeductibleOption",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Policy_DeductibleOption_DeductibleOptionId1",
                        column: x => x.DeductibleOptionId1,
                        principalTable: "DeductibleOption",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Policy_InsurancePlan_InsurancePlanId",
                        column: x => x.InsurancePlanId,
                        principalTable: "InsurancePlan",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Policy_Policy_PreviousPolicyNumber",
                        column: x => x.PreviousPolicyNumber,
                        principalTable: "Policy",
                        principalColumn: "PolicyNumber");
                    table.ForeignKey(
                        name: "FK_Policy_User_AgentId",
                        column: x => x.AgentId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PolicyNumber = table.Column<string>(type: "text", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Period = table.Column<string>(type: "text", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    ReceiptUrl = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Policy_PolicyNumber",
                        column: x => x.PolicyNumber,
                        principalTable: "Policy",
                        principalColumn: "PolicyNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyMember",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsTitular = table.Column<bool>(type: "boolean", nullable: false),
                    EntryDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    Exclusions = table.Column<string>(type: "text", nullable: true),
                    MemberType = table.Column<string>(type: "text", nullable: true),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: true),
                    PolicyId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyMember_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PolicyMember_Policy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "Policy",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PolicyNumber",
                table: "Payments",
                column: "PolicyNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_AgentId",
                table: "Policy",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_BankAccountId",
                table: "Policy",
                column: "BankAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_DeductibleOptionId",
                table: "Policy",
                column: "DeductibleOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_DeductibleOptionId1",
                table: "Policy",
                column: "DeductibleOptionId1");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_InsurancePlanId",
                table: "Policy",
                column: "InsurancePlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_PreviousPolicyNumber",
                table: "Policy",
                column: "PreviousPolicyNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Policy_TitularClientId",
                table: "Policy",
                column: "TitularClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyMember_ClientId",
                table: "PolicyMember",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyMember_PolicyId",
                table: "PolicyMember",
                column: "PolicyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PolicyMember");

            migrationBuilder.DropTable(
                name: "Policy");

            migrationBuilder.DropTable(
                name: "BankAccount");

            migrationBuilder.DropTable(
                name: "Clients");
        }
    }
}
