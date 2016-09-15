class ChangeColumnName < ActiveRecord::Migration
  def change
     rename_column :orders, :bid_id, :selected_bid_id
  end
end
