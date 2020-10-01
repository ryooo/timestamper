class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
  end

  def update
    if user = User.find(params[:user][:id])
      user.name = params[:user][:name].strip_all_space_and_empty_to_nil
      user.email = params[:user][:email].strip_all_space_and_empty_to_nil
      user.save!
      render_jsonps([
        Jsonp::PatchDataTables.new([
          {operation: 'update', data: user.to_hash},
        ]),
        Jsonp::AddFlashMessage.new("保存しました。", :notice),
      ])
    end
  end

  def delete
    if user = User.find(params[:user][:id])
      user.destroy!
      render_jsonps([
        Jsonp::PatchDataTables.new([
          {operation: 'delete', data: user.to_hash},
        ]),
        Jsonp::AddFlashMessage.new("削除しました。", :notice),
      ])
    end
  end

  def show
    render_jsonps([
      Jsonp::ShowModal.new(render_to_string(layout: nil)),
    ])
  end
end
