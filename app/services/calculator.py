TEACHER_SALARY = 15000
ADMIN_STAFF = 20000

ELECTRICITY_PER_STUDENT = 300
WATER_PER_STUDENT = 50
STATIONERY_PER_STUDENT = 150
MAINTENANCE_PER_STUDENT = 100

CONTINGENCY_RATE = 0.05


def calculate_school_budget(data):
    gross_revenue = data.totalStudents * data.feePerMonth

    teacher_salaries = data.numTeachers * TEACHER_SALARY
    admin_staff = ADMIN_STAFF

    electricity = data.totalStudents * ELECTRICITY_PER_STUDENT
    water = data.totalStudents * WATER_PER_STUDENT
    stationery = data.totalStudents * STATIONERY_PER_STUDENT
    maintenance = data.totalStudents * MAINTENANCE_PER_STUDENT

    rent = data.rentInput

    if data.overrides:
        if data.overrides.teacherSalaries is not None:
            teacher_salaries = data.overrides.teacherSalaries

        if data.overrides.adminStaff is not None:
            admin_staff = data.overrides.adminStaff

        if data.overrides.electricity is not None:
            electricity = data.overrides.electricity

        if data.overrides.water is not None:
            water = data.overrides.water

        if data.overrides.stationery is not None:
            stationery = data.overrides.stationery

        if data.overrides.maintenance is not None:
            maintenance = data.overrides.maintenance

        if data.overrides.rent is not None:
            rent = data.overrides.rent

    base_expenses = (
        teacher_salaries
        + admin_staff
        + electricity
        + water
        + stationery
        + maintenance
        + rent
    )

    contingency = base_expenses * CONTINGENCY_RATE

    total_expenses = base_expenses + contingency

    remaining_amount = gross_revenue - total_expenses

    return {
        "grossRevenue": gross_revenue,
        "expenses": {
            "teacherSalaries": teacher_salaries,
            "adminStaff": admin_staff,
            "electricity": electricity,
            "water": water,
            "stationery": stationery,
            "maintenance": maintenance,
            "rent": rent,
        },
        "baseExpenses": base_expenses,
        "contingency": contingency,
        "totalExpenses": total_expenses,
        "remainingAmount": remaining_amount,
    }