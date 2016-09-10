class AddPalletsHeightToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :pallets_height, :float
  end
end
