class User < ActiveRecord::Base
  before_save :default_values
  has_many :orders
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable
  ROLES = {customer: 'customer',
           driver: 'driver',
           drivers_company: 'drivers_company',
           dispatcher: 'dispatcher',
           admin: 'admin'}

  def default_values
    if role.nil?
      self.role = 'customer'
    end
  end



  def active_adminable?
    role == ROLES[:admin]
  end

  

end
