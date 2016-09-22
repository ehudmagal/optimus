class Bid < ActiveRecord::Base
  belongs_to :user
  belongs_to :order
  before_save :default_values
  before_save :set_order_status
  STATUSES = {pending: 'pending', over: 'over',selected: 'selected'}
  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
  private
  def default_values
    self.status ||= STATUSES[:pending]
  end

  def set_order_status
    if order.status == Order::STATUSES[:booked]
      order.update status: Order::STATUSES[:bidded]
    end
    if status == STATUSES[:selected]
      order.update status: Order::STATUSES[:approved]
    end
  end
end
