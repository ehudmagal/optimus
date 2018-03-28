class AddTypeToUser < ActiveRecord::Migration
  def up
    add_column :users, :type, :string
    users = User.select{|u| u.role == 'supplier'}
    users.map{|u| u.update type: 'Driver'}
  end

  def down
    remove_column :users, :type
  end

end
