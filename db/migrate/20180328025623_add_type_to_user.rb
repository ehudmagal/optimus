class AddTypeToUser < ActiveRecord::Migration
  def up
    add_column :users, :type, :string
    update_users_type('supplier','Driver')
    update_users_type('customer','Customer')
  end

  def down
    remove_column :users, :type
  end


  def update_users_type(role, type)
    users = User.select{|u| u.role == role}
    users.map{|u| u.update type: type}
  end

end
