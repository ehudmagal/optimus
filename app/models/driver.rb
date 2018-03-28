class Driver < User
  def orders_closed_with_user(user_id)
    user = User.find user_id
    bids = Bid.where(user_id: user.id);
    orders = Order.where(selected_bid_id: bids.pluck(:id)).where(user_id: id)
    return orders
  end
end
