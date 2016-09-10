class AddPalletsWidthToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :pallets_width, :float
  end
end
