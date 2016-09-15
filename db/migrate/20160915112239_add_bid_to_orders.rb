class AddBidToOrders < ActiveRecord::Migration
  def change
    add_reference :orders, :bid, index: true, foreign_key: true
  end
end
