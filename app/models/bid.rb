class Bid < ActiveRecord::Base
  belongs_to :user
  belongs_to :order
  after_create :default_values
  STATUSES = {pending: 'pending', over: 'over',selected: 'selected'}
  def json_attributes
    json = as_json
    json['user'] = user
    json
  end
  private
  def default_values
    self.update status: STATUSES[:pending]
  end
end
