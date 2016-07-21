class AddFixedPriceToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :fixed_price, :float
  end
end
