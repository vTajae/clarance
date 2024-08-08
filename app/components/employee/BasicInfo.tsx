import { ApplicantFormValues } from "../form86/lastTry/formDefinition copy 2";

interface BasicInfoProps {
  user: ApplicantFormValues;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ user }: BasicInfoProps) => {
  const { personalInfo } = user;

  return (
    <section className="bg-white relative">
      <div className="container mx-auto p-4 lg:p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {personalInfo && (
          <>
            <p className="text-sm">{`ID: ${personalInfo.applicantID}`}</p>

            {/* Name and Position */}
            <div className="md:col-span-3 lg:col-span-5 text-center md:text-start row-span-1 flex flex-col justify-center items-center md:items-start">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                {`First Name:  ${personalInfo.firstName}`}
                {personalInfo.middleName &&
                  ` Middle Name:${personalInfo.middleName}`}
              </h2>
              <p className="text-xl">
                {`Last Name: ${personalInfo.lastName}`}
                {personalInfo.suffix && `, ${personalInfo.suffix}`}
              </p>
            </div>         
          </>
        )}

        <div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
