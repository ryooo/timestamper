class Enum::WageType < Enum::Base
  HOURLY = self.new(1, :"時給")
  DAILY = self.new(1, :"日給")
  NOTHING = self.new(1, :"なし")
end
