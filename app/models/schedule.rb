class Schedule < ActiveRecord::Base
  def as_json(options = nil)
    h = super(options || {})
    h[:type] = self.class.name.split("::").last.downcase
    h
  end
end
