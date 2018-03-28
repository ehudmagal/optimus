class AddTypeToUser < ActiveRecord::Migration
  def up
    add_column :users, :type, :string
  end

  def down
    remove_column :users
  end

end
