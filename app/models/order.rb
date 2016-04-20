class Order < ActiveRecord::Base
  belongs_to :user

  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
end
