current_user = User.last
@stamp = Stamp.find_or_create_by(
  organization_id: current_user.organization_id,
  user_id: current_user.id,
  date: Date.today,
)
@stamp.in(Date.today + 7.hours + 55.minutes)
@stamp.out(Date.today + 12.hours + 30.minutes)
@stamp.in(Date.today + 13.hours + 23.minutes)
@stamp.out(Date.today + 13.hours + 45.minutes)
@stamp.in(Date.today + 13.hours + 48.minutes)
@stamp.save!
