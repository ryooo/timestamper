current_user = User.last
Timeframe.connection.execute "TRUNCATE TABLE timeframes;"
time = Time.current - 30.days
while time < Time.current
  Timeframe.create!(
    organization_id: current_user.organization_id,
    user_id: current_user.id,
    in_at: (time += (1..300).to_a.sample.minutes),
    out_at: (time += (1..300).to_a.sample.minutes),
  )
end

Timeframe.connection.execute "DELETE FROM users where name like 'テストユーザー%';"
200.times do |i|
  User.create!(
    organization_id: current_user.organization_id,
    name: "テストユーザー #{i}",
    email: "hogehoge@gmail"
  )
end

