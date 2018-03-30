module Users
  class DriversCompany < User
    has_many :drivers
  end
end
