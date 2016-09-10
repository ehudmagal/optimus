class AddContactInfoToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :contact_info, :string
  end
end
