class AddPickupTimeToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :pickup_time, :datetime
    add_column :orders, :pickup_ready_time, :datetime
    add_column :orders, :pickup_cutoff_time, :datetime
    add_column :orders, :delivery_time, :datetime
    add_column :orders, :delivery_deliver_after_time, :datetime
    add_column :orders, :delivery_cutoff_time, :datetime
  end
end
