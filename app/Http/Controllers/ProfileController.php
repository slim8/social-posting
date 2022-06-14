<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\User;
use GuzzleHttp\Psr7\Response;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    use UserTrait , RequestsTrait;
    


    /**
     * Display the specified profile.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id = null)
    {
        return $id ?  User::findOrFail($id) : UserTrait::getUserObject() ;
    }

    /**
     * Update the specified profile in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        //
        $validation = Validator::make($request->all(),[
            'email' => 'required|email',
            'firstName' => 'required',
            'lastName' => 'required',
        ]);

        if ($validation->fails()) {
            return Response()->json($validation->errors() , 422);
        }

        $user = User::where('id',UserTrait::getCurrentId())->update($request->all());
        return RequestsTrait::processResponse(true);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $validation = Validator::make($request->all(),[
            'currentPassword' => 'required|string|min:6',
            'password' => 'required|string|min:6',
            'passwordConfirmation' => 'required|string|min:6',
        ]);

        if ($validation->fails()) {
            return Response()->json($validation->errors() , 422);
        }

        if($request->password !== $request->passwordConfirmation){
            return RequestsTrait::processResponse(false , ['passwordConfirmation' => ['Password did not match']]);
        }
        $user = User::where('id',UserTrait::getCurrentId())->first();

        if(!Hash::check($request->currentPassword, $user->password)){
            return RequestsTrait::processResponse(false , [ 'currentPassword' => ['Invalid password']]);
        }
        
        return $user->update(['password' => Hash::make($request->password)]) ;
    }
}
