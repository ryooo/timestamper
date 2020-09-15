class Schedule < ActiveRecord::Base
  def as_json(options = {})
    h = super(options)
    h[:type] = self.class.name.split("::").last.downcase
    h
  end
end
