import { useState } from "react"
import { Camera } from "lucide-react"
import { FormInput } from "@/components/FormInput"
import { FormSelect } from "@/components/FormSelect"

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "Leslie",
    lastName: "Cooper",
    email: "example@gmail.com",
    phone: "+0123-456-789",
    gender: "Female",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const genderOptions = [
    { value: "Female", label: "Female" },
    { value: "Male", label: "Male" },
    { value: "Other", label: "Other" },
  ]

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Profile Picture Section */}
      <div className="bg-muted p-6 border-b border-border">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center">
                <Camera size={40} className="text-muted" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <FormInput
            label={
              <>
                First Name <span className="text-destructive">*</span>
              </>
            }
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            useRegister={false}
            errors={{}}
          />

          {/* Last Name */}
          <FormInput
            label={
              <>
                Last Name <span className="text-destructive">*</span>
              </>
            }
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            useRegister={false}
            errors={{}}
          />
        </div>

        {/* Email */}
        <FormInput
          label={
            <>
              Email <span className="text-destructive">*</span>
            </>
          }
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          useRegister={false}
          errors={{}}
        />

        {/* Phone */}
        <FormInput
          label={
            <>
              Phone <span className="text-destructive">*</span>
            </>
          }
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          useRegister={false}
          errors={{}}
        />

        {/* Gender */}
        <FormSelect
          label={
            <>
              Gender <span className="text-destructive">*</span>
            </>
          }
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={genderOptions}
          useRegister={false}
          errors={{}}
        />

        {/* Submit Button */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="px-8 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Update Changes
          </button>
        </div>
      </form>
    </div>
  )
}
