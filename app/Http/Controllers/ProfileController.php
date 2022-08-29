<?php

namespace App\Http\Controllers;

use App\Http\Traits\RequestsTrait;
use App\Http\Traits\UserTrait;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    protected $traitController;

    public function __construct()
    {
        $this->traitController = new TraitController();
    }
    /**
     * Display the specified profile.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show(int $id = null)
    {
        $userObject = $id ? User::findOrFail($id) : $this->traitController->getUserObject();
        $userObject->companyName = Company::where('id' , $userObject->companyId)->first()->name;

        return $userObject;
    }

    /**
     * Update the specified profile in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'email' => 'required|email',
            'firstName' => 'required',
            'lastName' => 'required',
        ]);

        if ($validation->fails()) {
            return Response()->json($validation->errors(), 422);
        }

        User::where('id', $this->traitController->getCurrentId())->update($request->all());

        return $this->traitController->processResponse(true);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'currentPassword' => 'required|string|min:6',
            'password' => 'required|string|min:6',
            'passwordConfirmation' => 'required|string|min:6',
        ]);

        if ($validation->fails()) {
            return Response()->json($validation->errors(), 422);
        }

        if ($request->password !== $request->passwordConfirmation) {
            return $this->traitController->processResponse(false, ['passwordConfirmation' => ['Password did not match']]);
        }
        $user = User::where('id', $this->traitController->getCurrentId())->first();

        if (!Hash::check($request->currentPassword, $user->password)) {
            return $this->traitController->processResponse(false, ['currentPassword' => ['Invalid password']]);
        }
        $user->update(['password' => Hash::make($request->password)]);

        return $this->traitController->processResponse(true);
    }
}
