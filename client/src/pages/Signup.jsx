import { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  Container,
  useToast,
  useDisclosure,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";
import NavDrawer from "../components/NavDrawer";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

import { API_CONFIG, COLORS } from "../constants";
import { uploadMultipleSignupDocuments } from "../utils/fileUpload";
import { useLanguage } from "../hooks/LanguageContext";
import { translator } from "../utils/translator";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(true);

  // File upload states
  const [licenseFileName, setLicenseFileName] = useState("");
  const [govIdFileName, setGovIdFileName] = useState("");
  const [businessFileName, setBusinessFileName] = useState("");
  const [resaleFileName, setResaleFileName] = useState("");

  // File upload error states
  const [licenseFileError, setLicenseFileError] = useState("");
  const [govIdFileError, setGovIdFileError] = useState("");
  const [businessFileError, setBusinessFileError] = useState("");
  const [resaleFileError, setResaleFileError] = useState("");

  // File references for actual file objects
  const [licenseFile, setLicenseFile] = useState(null);
  const [govIdFile, setGovIdFile] = useState(null);
  const [businessFile, setBusinessFile] = useState(null);
  const [resaleFile, setResaleFile] = useState(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedLanguage } = useLanguage();

  const form = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!regex.test(value) ? "Invalid email address" : "");
  };

  const validateLicense = (value) => {
    const regex = /^[A-Z]{2}-?\d{6,7}$/i;
    setLicenseError(
      value && !regex.test(value)
        ? "License must be in format LA-1234567 or CA1234567"
        : ""
    );
  };

  const inputStyle = {
    borderRadius: "full",
    bg: COLORS.GRAY_LIGHT,
    border: "1px solid",
    borderColor: "gray.300",
    px: 4,
    py: 2,
    _focus: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px blue.400",
    },
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed";
    }

    return "";
  };

  const FileUploadField = ({
    id,
    name,
    fileName,
    setFileName,
    helpText,
    error,
    setError,
    setFile,
  }) => (
    <Box mb={2} key={`file-upload-${id}`}>
      <input
        id={id}
        name={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const validationError = validateFile(file);
            if (validationError) {
              setError(validationError);
              setFileName("");
              toast({
                title: "Invalid file",
                description: validationError,
                status: "error",
                duration: 4000,
                isClosable: true,
              });
            } else {
              setError("");
              setFileName(file.name);
              if (setFile) setFile(file);
              toast({
                title: "File uploaded successfully",
                description: `${file.name} is ready to submit`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }
          } else {
            setFileName("");
            setError("");
            if (setFile) setFile(null);
          }
        }}
      />
      <Flex align="flex-start" gap={2}>
        <Button
          as="label"
          htmlFor={id}
          variant="link"
          fontSize="sm"
          color="blue.500"
          textDecoration="underline"
          cursor="pointer"
          p={0}
          h="auto"
          fontWeight="normal"
          flexShrink={0}
        >
          Attached file
        </Button>
        <Text fontSize="sm" color="gray.500" lineHeight="1.4">
          {helpText}
        </Text>
      </Flex>
      {fileName && (
        <Text fontSize="xs" color="green.600" mt={1} fontWeight="medium">
          ✓ Selected: {fileName}
        </Text>
      )}
      {error && (
        <Text fontSize="xs" color="red.500" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  );

  const CustomCheckbox = ({
    checked,
    onChange,
    children,
    disabled = false,
  }) => (
    <Box
      display="flex"
      alignItems="flex-start"
      cursor={disabled ? "default" : "pointer"}
      onClick={disabled ? undefined : onChange}
      mb={4}
      key={`checkbox-${Math.random()}`}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        width="18px"
        height="18px"
        minWidth="18px"
        border="2px solid"
        borderColor={COLORS.PRIMARY}
        bg={checked ? COLORS.PRIMARY : "white"}
        mr={3}
        mt={1}
        transition="all 0.2s"
      >
        {checked ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4 8L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </Box>
      <Text fontSize="sm" color="gray.700" lineHeight="1.4">
        {children}
      </Text>
    </Box>
  );

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (
      emailError ||
      licenseError ||
      licenseFileError ||
      govIdFileError ||
      businessFileError ||
      resaleFileError
    ) {
      toast({
        title: "Please fix form errors.",
        description: "Check all form fields and file uploads for errors.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!agreementChecked) {
      toast({
        title: "Agreement required.",
        description:
          "You must acknowledge the wholesale eligibility requirements.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare user data
      const userData = {
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        companyName: formData.get("company"),
        email: formData.get("email"),
        password,
        licenseNumber: formData.get("business_license"),
        companyAddress1: formData.get("company_address_1"),
        companyAddress2: formData.get("company_address_2"),
        zipCode: formData.get("zip_code"),
        city: formData.get("city"),
        state: formData.get("state"),
        phone: formData.get("phone"),
        californiaResale: formData.get("california_resale"),
        timestamp: new Date().toISOString(),
      };

      // Collect files for upload
      const filesToUpload = [];
      if (licenseFile)
        filesToUpload.push({
          file: licenseFile,
          documentType: "business-license",
        });
      if (govIdFile)
        filesToUpload.push({ file: govIdFile, documentType: "government-id" });
      if (businessFile)
        filesToUpload.push({
          file: businessFile,
          documentType: "business-document",
        });
      if (resaleFile)
        filesToUpload.push({
          file: resaleFile,
          documentType: "resale-certificate",
        });

      // Create account and upload documents
      setUploadProgress("Creating account...");

      const result = await uploadMultipleSignupDocuments(
        filesToUpload,
        userData,
        (current, total, docType) => {
          setUploadProgress(`Uploading ${docType}... (${current}/${total})`);
        }
      );

      if (result.success) {
        if (result.errors && result.errors.length > 0) {
          console.warn("Some files failed to upload:", result.errors);

          // Categorize errors for better user feedback
          const s3Errors = result.errors.filter((err) => err.isS3Error);
          const networkErrors = result.errors.filter(
            (err) => err.isNetworkError
          );
          const otherErrors = result.errors.filter(
            (err) => !err.isS3Error && !err.isNetworkError
          );

          let errorMessage = `${result.errors.length} document(s) failed to upload.`;

          if (s3Errors.length > 0) {
            errorMessage += ` S3 storage issues: ${s3Errors
              .map((e) => e.documentType)
              .join(", ")}.`;
          }
          if (networkErrors.length > 0) {
            errorMessage += ` Network issues: ${networkErrors
              .map((e) => e.documentType)
              .join(", ")}.`;
          }
          if (otherErrors.length > 0) {
            errorMessage += ` Other issues: ${otherErrors
              .map((e) => e.documentType)
              .join(", ")}.`;
          }

          errorMessage += " Please contact support if needed.";

          toast({
            title: "Documents upload warning",
            description: errorMessage,
            status: "warning",
            duration: 8000,
            isClosable: true,
          });
        }

        setUploadProgress("");

        toast({
          title: "Signup request submitted!",
          description:
            "Please wait for admin approval. You'll be contacted within 1-2 business days.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        // Handle signup failure
        console.error("Signup failed:", result.errors);

        let errorTitle = "Signup failed";
        let errorMessage = "Please try again later.";

        if (result.errors && result.errors.length > 0) {
          const firstError = result.errors[0];

          if (firstError.isS3Error) {
            errorTitle = "Document upload failed";
            errorMessage = `S3 storage error: ${firstError.error}. Your account may have been created, but documents failed to upload.`;
          } else if (firstError.isNetworkError) {
            errorTitle = "Network error";
            errorMessage = `Connection error: ${firstError.error}. Please check your internet connection and try again.`;
          } else {
            errorMessage = firstError.error || "Unknown error occurred.";
          }
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);

      let errorTitle = "Server error";
      let errorMessage = "Please try again later.";

      // Check if it's a network error that might indicate S3 issues
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        errorTitle = "Connection error";
        errorMessage =
          "Unable to connect to our servers. This might be due to S3 storage service being unavailable. Please check your internet connection and try again.";
      } else if (err.message.includes("S3") || err.message.includes("AWS")) {
        errorTitle = "Storage service error";
        errorMessage =
          "Our document storage service (S3) is currently unavailable. Please try again later or contact support.";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <Sidebar>
      <NavDrawer isOpen={isOpen} onClose={onClose} containerRef={contentRef} />
      <Container
        ref={contentRef}
        maxW={{ base: "100%", lg: "30%" }}
        p={0}
        bg="white"
        boxShadow="xl"
        ml={{ base: 0, lg: "40%" }}
      >
        <Navbar onOpen={onOpen} />

        <Box py={3} px={4} display="flex" justifyContent="center">
          <Breadcrumbs
            listOfBreadCrumbs={[
              { label: "Home", url: "/" },
              { label: "Create Account", url: "/signup" },
            ]}
          />
        </Box>

        <Box px={6} py={4}>
          <Heading mb={3} fontWeight="medium" fontSize="3xl" textAlign="center">
            Create Account
          </Heading>
          <Text mb={4} color="gray.500" fontSize="md" textAlign="center">
            Join our wholesale platform. We look forward to working with you!
          </Text>
          <Divider mb={6} borderColor="gray.300" />

          <form ref={form} onSubmit={handleSignup}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  First Name
                </FormLabel>
                <Input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Last Name
                </FormLabel>
                <Input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Company/Business Name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Your Business Name"
                  name="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  {...inputStyle}
                />
                {emailError && (
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  {...inputStyle}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Company Address line 1
                </FormLabel>
                <Input
                  type="text"
                  name="company_address_1"
                  placeholder="1805 Industrial St"
                  {...inputStyle}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Company Address line 2
                </FormLabel>
                <Input
                  type="text"
                  name="company_address_2"
                  placeholder="Suite 100"
                  {...inputStyle}
                />
              </FormControl>

              <Flex gap={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">
                    Zip code
                  </FormLabel>
                  <Input
                    type="text"
                    name="zip_code"
                    placeholder="90021"
                    {...inputStyle}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">
                    City
                  </FormLabel>
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    {...inputStyle}
                  />
                </FormControl>
              </Flex>

              <Flex gap={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">
                    State
                  </FormLabel>
                  <Input
                    type="text"
                    name="state"
                    placeholder="CA"
                    {...inputStyle}
                  />{" "}
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="sm">
                    Phone
                  </FormLabel>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="(123) 456-7890"
                    {...inputStyle}
                  />
                </FormControl>
              </Flex>

              <FormControl isRequired isInvalid={licenseError !== ""}>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Business License
                </FormLabel>
                <Input
                  type="text"
                  name="business_license"
                  placeholder="LA-1234567 or 2025-000123"
                  value={licenseNumber}
                  onChange={(e) => {
                    setLicenseNumber(e.target.value);
                    validateLicense(e.target.value);
                  }}
                  {...inputStyle}
                />
                {licenseError && (
                  <FormErrorMessage>{licenseError}</FormErrorMessage>
                )}

                <Box mt={2}>
                  <FileUploadField
                    id="license-file-upload"
                    name="license_file"
                    fileName={licenseFileName}
                    setFileName={setLicenseFileName}
                    setFile={setLicenseFile}
                    error={licenseFileError}
                    setError={setLicenseFileError}
                    helpText={translator(
                      "*Please attach the Business License (PDF, JPG, PNG only, max 10MB)",
                      "*사업자등록증을 첨부해 주세요."
                    )}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  California Resale Certificate (CDTFA-230)
                </FormLabel>
                <Input
                  type="text"
                  name="california_resale"
                  placeholder="# 123-456789"
                  {...inputStyle}
                />{" "}
                <Box mt={2}>
                  <FileUploadField
                    id="resale-cert-upload"
                    name="resale_cert_file"
                    fileName={resaleFileName}
                    setFileName={setResaleFileName}
                    setFile={setResaleFile}
                    helpText={translator(
                      "*Please attach the California Resale Certificate (PDF, JPG, PNG only, max 10MB)",
                      "*CA 재판매 증명서를 첨부해 주세요."
                    )}
                    error={resaleFileError}
                    setError={setResaleFileError}
                  />
                </Box>
              </FormControl>
              <CustomCheckbox
                checked={true}
                disabled={true}
                onChange={() => setAgreementChecked(!agreementChecked)}
              >
                {translator(
                  "To ensure wholesale eligibility, please provide your license number and upload a copy during sign-up.",
                  "도매 자격 확인을 위해 가입 시 사업자 등록번호를 기재하고 사본을 업로드해 주세요."
                )}
              </CustomCheckbox>

              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Government issued ID (e.g., Driver's License)
                </FormLabel>
                <FileUploadField
                  id="gov-id-file-upload"
                  name="gov_id_file"
                  fileName={govIdFileName}
                  setFileName={setGovIdFileName}
                  setFile={setGovIdFile}
                  helpText={translator(
                    "*Please attach the government ID (PDF, JPG, PNG only, max 10MB).",
                    "*도매 라이선스를 첨부해 주세요."
                  )}
                  error={govIdFileError}
                  setError={setGovIdFileError}
                />
              </FormControl>

              {/* <FormControl>
                <FormLabel fontWeight="semibold" fontSize="sm">
                  Business License or Reseller Permit
                </FormLabel>
                <FileUploadField
                  id="business-file-upload"
                  name="business_file"
                  fileName={businessFileName}
                  setFileName={setBusinessFileName}
                  setFile={setBusinessFile}
                  helpText={translator(
                                "*Please attach the business license."
                      , "*도매 라이선스를 첨부해 주세요."
                              )
                  }
                  error={businessFileError}
                  setError={setBusinessFileError}
                />
              </FormControl> */}

              <Box bg="gray.50" p={4} borderRadius="md">
                <CustomCheckbox checked={true} disabled={true}>
                  {translator(
                    "Please allow 1-2 business days for account review and verification. Accounts that do not meet our criteria may be declined without notice. Providing complete and accurate documentation helps speed up the approval process.",
                    "계정 검토 및 인증에는 24~48시간이 소요될 수 있습니다. 당사 기준에 부합하지 않는 계정은 사전 통보 없이 거절될 수 있습니다. 완전하고 정확한 서류를 제출하면 승인 절차가 더 빨라집니다."
                  )}
                </CustomCheckbox>
              </Box>

              {uploadProgress && (
                <Box textAlign="center" mb={4}>
                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                    {uploadProgress}
                  </Text>
                </Box>
              )}

              <Box display="flex" justifyContent="center" width="100%" pt={4}>
                <Button
                  type="submit"
                  bg={COLORS.PRIMARY}
                  color="white"
                  isLoading={loading || uploadProgress !== ""}
                  loadingText={uploadProgress || "Creating Account..."}
                  borderRadius="full"
                  size="lg"
                  width="100%"
                  _hover={{ bg: COLORS.SECONDARY }}
                  _disabled={{ bg: "gray.400" }}
                >
                  CREATE ACCOUNT
                </Button>
              </Box>

              <Box textAlign="center" pt={4}>
                <Button
                  variant="link"
                  color={COLORS.PRIMARY}
                  fontWeight="bold"
                  textDecoration="underline"
                  onClick={() => navigate("/login")}
                  _hover={{ color: COLORS.SECONDARY }}
                >
                  Already have an account? Login
                </Button>
              </Box>
            </VStack>
            {/* <Button
              onClick={() => {
                setFirstName("John");
                setLastName("Doe");
                setCompanyName("Acme Restaurant Corp");
                setEmail("john.doe@acmerestaurant.com");
                setPassword("password123");
                setAgreementChecked(true);

                // Fill form inputs directly
                const form = document.querySelector("form");
                if (form) {
                  form.querySelector(
                    'input[placeholder="1805 Industrial St"]'
                  ).value = "1805 Industrial St";
                  form.querySelector('input[placeholder="Suite 100"]').value =
                    "Suite 100";
                  form.querySelector('input[placeholder="90021"]').value =
                    "90021";
                  form.querySelector('input[placeholder="City"]').value =
                    "Los Angeles";
                  form.querySelector('input[placeholder="CA"]').value = "CA";
                  form.querySelector(
                    'input[placeholder="(123) 456-7890"]'
                  ).value = "(323) 943-9318";
                  form.querySelector(
                    'input[placeholder="LA-1234567 or 2025-000123"]'
                  ).value = "LA-1234567";
                  form.querySelector(
                    'input[placeholder="# 123-456789"]'
                  ).value = "# 123-456789";
                }
              }}
              size="sm"
              colorScheme="orange"
              mb={4}
            >
              Fill Test Data
            </Button> */}
          </form>

          <Footer />
        </Box>
      </Container>
    </Sidebar>
  );
};

export default Signup;
