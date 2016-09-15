class User < ActiveRecord::Base
  before_save :default_values
  has_many :orders
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def default_values
    if role.nil?
      self.role = 'customer'
    end
  end

  def orders_closed_with_user(user_id)
    user = User.find user_id
    bids = Bid.where(user_id: user.id);
    orders = Order.where(selected_bid_id: bids.pluck(:id)).where(user_id: id)
    return orders
  end

end
