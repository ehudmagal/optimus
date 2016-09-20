class Bid < ActiveRecord::Base
  belongs_to :user
  belongs_to :order
  before_save :default_values
  after_create :set_order_status
  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
  private
  def default_values
    self.status ||= 'pending'
  end

  def set_order_status
    if order.status == Order::STATUSES[:booked]
      order.update status: Order::STATUSES[:bidded]
    end
  end
end
