class AddPalletsLengthToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :pallets_length, :float
  end
end
