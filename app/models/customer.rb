class Customer < User
  has_many :orders

  def orders_closed_with_driver(driver_id)
    driver = Driver.find driver_id
    bids = Bid.where(user_id: driver.id);
    orders = Order.where(selected_bid_id: bids.select(:id)).where(user_id: id)
    return orders
  end
end
