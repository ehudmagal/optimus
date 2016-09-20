class Bid < ActiveRecord::Base
  belongs_to :user
  belongs_to :order
  before_save :default_values

  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
  private
  def default_values
    self.status ||= 'pending'
  end
end
