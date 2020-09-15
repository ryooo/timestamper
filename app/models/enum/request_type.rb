class Enum::RequestType < Enum::Base
  WORK = self.new(1, :"出勤希望")
  HOLIDAY = self.new(2, :"休暇希望")
end
