class AddDistanceToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :distance, :float
  end
end
