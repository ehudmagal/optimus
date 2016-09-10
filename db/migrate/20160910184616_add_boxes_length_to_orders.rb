class AddBoxesLengthToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :boxes_length, :float
  end
end
