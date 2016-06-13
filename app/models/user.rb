class User < ActiveRecord::Base
  before_save :default_values
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def default_values
    if role.nil?
      role = 'customer'
    end
  end
end
