class Payment < ActiveRecord::Base
  belongs_to :customer
  belong_to :drivers_company
end
