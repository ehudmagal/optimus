class Order < ActiveRecord::Base
  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
end
